import styles from "./members.module.css";
import { useEffect, useState } from "react";
import Member from "../../../components/Member/member";
import BackgroundEffect from "../../../components/BackgroundEffect/backgroundEffect";
import copyImg from "../../../assets/images/icons/copy.png";

type MemberType = {
  userId: string;
  username: string;
  positions: { positionId: number; positionName: string; color: string }[];
  roles: { name: string }[];
};

type UserType = {
  id: string;
  roles: { name: string }[];
};

export default function Members() {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [invite, setInvite] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const isScrumMasterOrAdmin = currentUser?.roles?.some(
    (role) => role.name === "scrummaster" || role.name === "admin",
  );

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!invite) return;

    try {
      await navigator.clipboard.writeText(invite);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar", error);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8080/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setTeamId(data.teamId);
      setCurrentUser(data);
    }

    fetchUser();
  }, []);

  async function createInvite() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/teams/${teamId}/invites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao criar invite");
      }
      const data = await response.text();
      setInvite(data);
    } catch (error) {
      console.error("Erro ao criar invite", error);
    }
  }

  async function fetchMembers() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/teams/${teamId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Erro ao buscar items", error);
    }
  }

  useEffect(() => {
    if (!teamId) return;
    fetchMembers();
  }, [teamId]);

  return (
    <section>
      <h1>Membros</h1>
      <div className={styles.backgroundContainer}>
        <BackgroundEffect className={styles.background} />
      </div>
      <article>
        <div className={styles.members}>
          {currentUser &&
            teamId &&
            members.map((member) => (
              <Member
                key={member.userId}
                fetchMembers={fetchMembers}
                member={member}
                user={currentUser}
                teamId={teamId}
              />
            ))}
        </div>
        {isScrumMasterOrAdmin && (
          <div className={styles.conviteBtnContainer}>
            <button
              onClick={createInvite}
              disabled={!teamId}
              className={styles.conviteBtn}
            >
              Gerar convite
            </button>
            {!invite && (
              <p style={{ fontWeight: "normal", fontStyle: "Italic" }}>
                Código de Convite
              </p>
            )}
            {invite && (
              <>
                <button onClick={handleCopy} className={styles.inviteTextBtn}>
                  <p>
                    {invite}{" "}
                    {copied && (
                      <span
                        style={{ fontWeight: "normal", fontStyle: "Italic" }}
                      >
                        Copiado!
                      </span>
                    )}
                  </p>
                </button>
                <button className={styles.copyBtn} onClick={handleCopy}>
                  <img src={copyImg} alt="Copy" />
                </button>
              </>
            )}
          </div>
        )}
      </article>
    </section>
  );
}
